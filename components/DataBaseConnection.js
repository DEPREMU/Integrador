import { supabase } from "./supabaseClient";
import {
  generateToken,
  hashPassword,
  saltHashPassword,
  verifyPassword,
} from "./globalVariables";

const createTable = async (baseName) => {
  try {
    const { error } = await supabase.rpc("create_table", {
      name: baseName,
    });
    if (error) throw error;
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

const deleteTables = async (baseName) => {
  try {
    const { error } = await supabase.rpc("delete_tables", {
      name: baseName,
    });
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting table:", error);
  }
};

const signIn = async (restaurantName, user, password, role, name) => {
  try {
    const token = generateToken();

    if (role == "Owner") await createTable(restaurantName);

    const { error } = await supabase.from(restaurantName).select("*");
    if (error) return { success: false, error: error.message };

    await supabase.from(restaurantName).insert([
      {
        username: user,
        password: password,
        name: name,
        token: token,
        role: role,
      },
    ]);

    const { data: selectData, error: selectError } = await supabase
      .from(restaurantName)
      .select("*")
      .eq("username", user);
    if (selectError) {
      console.error("Error fetching user:", selectError.message);
      return { success: false, error: selectError.message };
    } else if (selectData.length > 0) {
      return { success: true, error: null };
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: error };
  }
  return { success: false, error: "Uknown error" };
};

const logIn = async (restaurantName, user, password) => {
  try {
    const { data, error } = await supabase
      .from(restaurantName)
      .select("*")
      .eq("username", user);
    if (data && data.length > 0) {
      const boolCorrectPassword = verifyPassword(data[0].password, password);
      if (!boolCorrectPassword)
        return {
          success: false,
          token: null,
          error: "UserOrPasswordWrong",
        };
      else if (boolCorrectPassword)
        return {
          success: true,
          token: data[0].token,
          data: data[0],
          tokenTime: data[0].tokenTime,
          error: null,
        };
    } else if (error && String(error.message).indexOf("does not exist") > 0)
      return {
        success: false,
        token: null,
        error: "restaurantDoesNotExist",
      };
  } catch (error) {
    console.error(error);
    return { success: false, token: null, error: error };
  }
  return { success: false, token: null, error: null };
};

const getRole = async (restaurantName, token) => {
  const { data, error } = await supabase
    .from(restaurantName)
    .select("role")
    .eq("token", token)
    .single();
  if (error) {
    console.error("Error getting role:", error.message);
    return { success: false, role: null, error: error.message };
  }
  return { success: true, role: data.role, error: null };
};

const getName = async (restaurantName, token) => {
  const { data, error } = await supabase
    .from(restaurantName)
    .select("name")
    .eq("token", token)
    .single();
  if (error) {
    console.error("Error getting name:", error.message);
    return { success: false, name: null, error: error.message };
  }
  return { success: true, name: data.name, error: null };
};

const boolIsRestaurant = async (restaurantName) => {
  try {
    const { data, error } = await supabase.from(restaurantName).select("*");
    if (data != null) return true;
    if (String(error.message).indexOf("does not exist") > 0) return false;
  } catch (error) {
    console.error(error);
  }
  return false;
};

const boolUserExist = async (restaurantName, userName) => {
  try {
    const { data } = await supabase
      .from(restaurantName)
      .select("*")
      .eq("username", userName);
    if (data && data.length > 0) return true;
  } catch (error) {
    console.error(error);
  }
  return false;
};

const deleteOrderDB = async (restaurantName, orderID) => {
  try {
    const restaurantNameOrders = `${restaurantName}_orders`;

    // 1. Eliminar la orden mediante orderID
    const { error: deleteError } = await supabase
      .from(restaurantNameOrders)
      .delete()
      .match({ id: orderID });

    if (deleteError) return { success: false, error: deleteError };

    // 2. Reordenar IDs en la tabla
    const { data: rows, error: fetchError } = await supabase
      .from(restaurantNameOrders)
      .select("*");

    if (fetchError) return { success: false, error: fetchError };

    // 3. Actualizar IDs
    const updates = rows.map((row, index) => ({
      id: row.id,
      new_id: index + 1,
    }));

    for (const update of updates) {
      const { error: updateError } = await supabase
        .from(restaurantNameOrders)
        .update({ id: update.new_id })
        .match({ id: update.id });

      if (updateError) return { success: false, error: updateError };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: error };
  }
};

const loadOrders = async (restaurantName) => {
  const { data, error } = await supabase
    .from(`${restaurantName}_orders`)
    .select("*");

  const orders = {};
  if (data && data.length > 0) {
    data.forEach((value) => {
      orders[value.id] = {
        order: value.order,
        characteristics: value.characteristics,
        orderTime: value.orderTime,
      };
    });
    return {
      success: true,
      orders: orders,
      error: null,
    };
  } else if (error) {
    console.error("Error loading orders:", error.message);
    return { success: false, orders: null, error: error.message };
  } else
    return {
      success: true,
      orders: null,
      error: null,
    };
};

export {
  createTable,
  signIn,
  logIn,
  getRole,
  boolIsRestaurant,
  getName,
  deleteOrderDB,
  loadOrders,
  boolUserExist,
  deleteTables,
};
