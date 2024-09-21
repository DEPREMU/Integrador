import { supabase } from "./supabaseClient";
import { generateToken } from "./globalVariables";

const createTable = async (baseName) => {
  try {
    const { data, error } = await supabase.rpc("create_table", {
      name: baseName,
    });
    if (error) throw error;
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

const authUser = async (restaurantName, username, password) => {
  try {
    const { data, error } = await supabase
      .from(restaurantName)
      .select("*")
      .eq("username", username);

    if (data != null) {
      if (password == data[0].password) return data;
    }
    if (error) {
      console.error("Error authenticating user:", error.message);
      throw error;
    }
  } catch (error) {
    console.error("Error authenticating user:", error.message);
    throw error;
  }
};

const signIn = async (restaurantName, user, password, role, name) => {
  try {
    const token = generateToken();

    if (role == "Owner") await createTable(restaurantName);

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
      return { success: false, user: "", error: selectError.message };
    } else if (selectData) {
      return { success: true, user: selectData[0].username, error: null };
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, user: null, error: error };
  }
  return { success: false, user: null, error: "Uknown error" };
};

const logIn = async (restaurantName, user, password) => {
  try {
    const { data, error } = await supabase
      .from(restaurantName)
      .select("*")
      .eq("username", user);
    if (data && data.length > 0) {
      if (data[0].password != password)
        return {
          success: false,
          token: null,
          data: null,
          error: "UserOrPasswordWrong",
        };
      else if (data[0].password == password)
        return {
          success: true,
          token: data[0].token,
          data: data[0],
          error: null,
        };
    } else if (error && String(error.message).indexOf("does not exist") > 0)
      return {
        success: false,
        token: null,
        error: "restaurantDoesNotExist",
      };
    else {
      return {
        success: false,
        token: null,
        error: "UserOrPasswordWrong",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, token: null, error: error };
  }
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

const getRoleByUser = async (restaurantName, user) => {
  const { data, error } = await supabase
    .from(restaurantName)
    .select("role")
    .eq("userName", user)
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

export {
  createTable,
  authUser,
  signIn,
  logIn,
  getRole,
  boolIsRestaurant,
  getName,
  getRoleByUser,
};
