import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from "../services/auth.service.js";

import {
  successResponse,
} from "../utils/apiResponse.js";

const setRefreshCookie = (
  res,
  refreshToken
) => {
  res.cookie(
    "refreshToken",
    refreshToken,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",
      maxAge:
        7 *
        24 *
        60 *
        60 *
        1000,
      path: "/api/v1/auth",
    }
  );
};

const clearRefreshCookie = (res) => {
  res.clearCookie(
    "refreshToken",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite:
        process.env.NODE_ENV ===
        "production"
          ? "none"
          : "lax",
      path: "/api/v1/auth",
    }
  );
};

const register = async (
  req,
  res
) => {
  const result =
    await registerUser(
      req.body,
      req
    );

  setRefreshCookie(
    res,
    result.refreshToken
  );

  return successResponse(
    res,
    {
      statusCode: 201,
      message:
        "Account created successfully",
      data: {
        user: result.user,
        accessToken:
          result.accessToken,
      },
    }
  );
};

const login = async (
  req,
  res
) => {
  const result =
    await loginUser(
      req.body.email,
      req.body.password,
      req
    );

  setRefreshCookie(
    res,
    result.refreshToken
  );

  return successResponse(
    res,
    {
      statusCode: 200,
      message:
        "Login successful",
      data: {
        user: result.user,
        accessToken:
          result.accessToken,
      },
    }
  );
};

const refresh = async (
  req,
  res
) => {
  const refreshToken =
    req.cookies.refreshToken;

  const result =
    await refreshSession(
      refreshToken,
      req
    );

  setRefreshCookie(
    res,
    result.refreshToken
  );

  return successResponse(
    res,
    {
      statusCode: 200,
      message:
        "Token refreshed successfully",
      data: {
        accessToken:
          result.accessToken,
        user: result.user,
      },
    }
  );
};

const logout = async (
  req,
  res
) => {
  const refreshToken =
    req.cookies.refreshToken;

  await logoutUser(
    refreshToken
  );

  clearRefreshCookie(res);

  return successResponse(
    res,
    {
      statusCode: 200,
      message:
        "Logged out successfully",
      data: null,
    }
  );
};

const getCurrentUser = async (
  req,
  res
) => {
  return successResponse(
    res,
    {
      statusCode: 200,
      message:
        "Current user fetched successfully",
      data: {
        user: req.user,
      },
    }
  );
};

export {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
};

