import { supabase } from "./supabaseClient";
import {
  appName,
  generateToken,
  tableNameErrorLogs,
  verifyPassword,
} from "./globalVariables";

const createTable = async (baseName) => {
  try {
    const { error } = await supabase.rpc("create_table", {
      name: baseName,
    });
    if (error) throw error;
  } catch (error) {
    console.error(`Error creating table: ${error}`);
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/createTable() catch (error) => Error creating table: ${error}`,
    });
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
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/deleteTables() catch (error) => Error deleting table: ${error}`,
    });
  }
};

const signIn = async (restaurantName, user, password, role, name) => {
  try {
    const token = generateToken();
    const dateToken = new Date().toString();

    if (role == "Owner") await createTable(restaurantName);

    const { error } = await supabase.from(restaurantName).select("*");
    if (error) {
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: error.message,
        date: new Date().toLocaleString(),
        component: `./DataBaseConnection/signIn() if (error) => Error fetching table: ${error}`,
      });
      return { success: false, error: error.message };
    }
    await supabase.from(restaurantName).insert([
      {
        username: user,
        password: password,
        name: name,
        token: token,
        tokenTime: dateToken,
        role: role,
        registerTime: dateToken,
      },
    ]);

    const { data: selectData, error: selectError } = await supabase
      .from(restaurantName)
      .select("*")
      .eq("username", user);
    if (selectError) {
      console.error("Error fetching user:", selectError.message);
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: selectError.message,
        date: new Date().toLocaleString(),
        component: `./DataBaseConnection/signIn() if (selectError) => Error fetching user: ${selectError}`,
      });
      await deleteTables(restaurantName);
      return { success: false, error: selectError.message };
    } else if (selectData && selectData.length > 0) {
      return { success: true, error: null };
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/signIn() catch (error) => Unexpected error: ${error}`,
    });
    await deleteTables(restaurantName);
    return { success: false, error: error };
  }
  await deleteTables(restaurantName);
  await insertInTable(tableNameErrorLogs, {
    appName: appName,
    error: "User not inserted correctly",
    date: new Date().toLocaleString(),
    component: `./DataBaseConnection/signIn() => User not inserted correctly`,
  });
  return { success: false, error: "User not inserted correctly" };
};

const logIn = async (restaurantName, user, password) => {
  try {
    const { data, error } = await supabase
      .from(restaurantName)
      .select("*")
      .eq("username", user)
      .single();

    if (data) {
      const boolCorrectPassword = verifyPassword(data.password, password);
      if (boolCorrectPassword) {
        const newToken = generateToken();
        const newDate = new Date().toString();
        await updateTableByEq(
          restaurantName,
          { token: newToken, tokenTime: newDate },
          user,
          "username"
        );
        const newData = data;
        newData.token = newToken;
        newData.tokenTime = newDate;

        return {
          success: true,
          token: newToken,
          data: newData,
          error: null,
        };
      }
    } else if (error && String(error.message).indexOf("does not exist") > 0)
      return {
        success: false,
        token: null,
        error: "restaurantDoesNotExist",
      };
  } catch (error) {
    console.error(error);
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/logIn() catch (error) => ${error}`,
    });
    return { success: false, token: null, error: error };
  }
  return {
    success: false,
    token: null,
    error: "UserOrPasswordWrong",
  };
};

const getRole = async (restaurantName, token) => {
  const { data, error } = await supabase
    .from(restaurantName)
    .select("role")
    .eq("token", token)
    .single();
  if (error) {
    console.error("Error getting role:", error.message);
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error.message,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/getRole() if (error) => Error getting role: ${error}`,
    });
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
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error.message,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/getName() if (error) => Error getting name: ${error}`,
    });
    return { success: false, name: null, error: error.message };
  }
  return { success: true, name: data.name, error: null };
};

const getDateToken = async (restaurantName, token) => {
  const { data, error } = await supabase
    .from(restaurantName)
    .select("tokenTime")
    .eq("token", token)
    .single();

  if (error) {
    console.error("Error getting date token:", error.message);
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error.message,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/getDateToken() if (error) => Error getting name: ${error}`,
    });
    return { success: false, dateToken: null, error: error.message };
  }
  return { success: true, dateToken: data.tokenTime, error: null };
};

const boolIsRestaurant = async (restaurantName) => {
  try {
    const { data, error } = await supabase.from(restaurantName).select("*");
    if (data != null) return true;
    if (String(error.message).indexOf("does not exist") > 0) return false;
  } catch (error) {
    console.error(error);
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/boolIsRestaurant() catch (error) => ${error}`,
    });
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
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/boolUserExist() catch (error) => ${error}`,
    });
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

    if (deleteError) {
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: deleteError,
        date: new Date().toLocaleString(),
        component: `./DataBaseConnection/deleteOrderDB() if (deleteError) => Error deleting order: ${deleteError}`,
      });
      return { success: false, error: deleteError };
    }

    // 2. Reordenar IDs en la tabla
    const { data: rows, error: fetchError } = await supabase
      .from(restaurantNameOrders)
      .select("*");

    if (fetchError) {
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: fetchError,
        date: new Date().toLocaleString(),
        component: `./DataBaseConnection/deleteOrderDB() if (fetchError) => Error fetching rows: ${fetchError}`,
      });
      return { success: false, error: fetchError };
    }

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

      if (updateError) {
        await insertInTable(tableNameErrorLogs, {
          appName: appName,
          error: updateError,
          date: new Date().toLocaleString(),
          component: `./DataBaseConnection/deleteOrderDB() if (updateError) => Error updating rows: ${updateError}`,
        });
        return { success: false, error: updateError };
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error:", error);
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/deleteOrderDB() catch (error) => Error: ${error}`,
    });
    return { success: false, error: error };
  }
};

const deleteFromTable = async (
  tableName,
  count = "*",
  columnEqual,
  valueEqual
) => {
  if (!count) count = "*";
  await supabase.from(tableName).delete(count).eq(columnEqual, valueEqual);
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
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error.message,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/loadOrders() else if (error) => Error loading orders: ${error}`,
    });
    return { success: false, orders: null, error: error.message };
  } else
    return {
      success: false,
      orders: null,
      error: null,
    };
};

const updateTableByDict = async (restaurantName, token, dict) => {
  try {
    const { error } = await supabase
      .from(restaurantName)
      .update(dict)
      .eq("token", token);
    if (error) {
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: error,
        date: new Date().toLocaleString(),
        component: `./DataBaseConnection/updateTableByDict() if (error) => Error updating table: ${error}`,
      });
      throw error;
    }
  } catch (error) {
    console.error("Error updating table:", error);
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/updateTableByDict() catch (error) => Error updating table: ${error}`,
    });
  }
};

const updateTableByEq = async (restaurantName, dict, value, equal) => {
  try {
    const { error } = await supabase
      .from(restaurantName)
      .update(dict)
      .eq(equal, value);
    if (error) {
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: error,
        date: new Date().toLocaleString(),
        component: `./DataBaseConnection/updateTable() if (error) => Error updating table: ${error}`,
      });
      throw error;
    }
  } catch (error) {
    console.error("Error updating table:", error);

    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/updateTable() catch (error) => Error updating table: ${error}`,
    });
  }
};

const showColumnsFromTable = async (restaurantName) => {
  try {
    const { data, error } = await supabase
      .from(restaurantName)
      .select("*")
      .limit(1);
    if (error) {
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: error,
        date: new Date().toLocaleString(),
        component: `./DataBaseConnection/showColumnsFromTable() if (error) => Error showing columns: ${error}`,
      });
      throw error;
    }
    if (data.length > 0) {
      const columnNames = Object.keys(data[0]);
    } else {
      console.log("No data found in the table.");
    }
  } catch (error) {
    console.error("Error showing columns:", error);
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/showColumnsFromTable() catch (error) => Error showing columns: ${error}`,
    });
  }
};

const insertInTable = async (tableName, dict) => {
  try {
    await supabase.from(tableName).insert(dict);
  } catch (error) {
    return error;
  }
  return null;
};

const getAllDataFromTable = async (tableName) => {
  try {
    const { data, error } = await supabase.from(tableName).select("*");
    if (error) {
      await insertInTable(tableNameErrorLogs, {
        appName: appName,
        error: error,
        date: new Date().toLocaleString(),
        component: `./DataBaseConnection/getAllDataFromTable() if (error) => Error fetching data: ${error}`,
      });
    }
    if (data) return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    await insertInTable(tableNameErrorLogs, {
      appName: appName,
      error: error,
      date: new Date().toLocaleString(),
      component: `./DataBaseConnection/getAllDataFromTable() catch (error) => Error fetching data: ${error}`,
    });
  }
  return null;
};

export {
  logIn,
  signIn,
  getName,
  getRole,
  loadOrders,
  createTable,
  updateTableByEq,
  deleteTables,
  getDateToken,
  boolUserExist,
  deleteOrderDB,
  insertInTable,
  deleteFromTable,
  boolIsRestaurant,
  updateTableByDict,
  getAllDataFromTable,
  showColumnsFromTable,
};
