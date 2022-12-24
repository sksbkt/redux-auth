import { BaseQueryApi, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "../../features/auth/authSlice";
import { BaseQueryFn } from "../types/types";



const baseQuery = fetchBaseQuery(
    {
        baseUrl: 'http://localhost:3500',
        credentials: 'include',
        prepareHeaders: (headers: any, { getState }: any) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }
);

async function baseQueryWithReauth(arg: BaseQueryFn, api: any, extraOptions: {}) {
    let result = await baseQuery(arg, api, extraOptions);
    if (result?.error?.status === 403) {
        console.log('sending refresh token');
        //? send refresh token to get new access token
        const refreshResult = await baseQuery('/refresh', api, extraOptions);
        console.log(refreshResult);
        if (refreshResult?.data) {
            const user = api.getState().auth.user;
            //? store the new token
            api.dispatch(setCredentials({ ...refreshResult.data, user }));
            //? retry the original query
            result = await baseQuery(arg, api, extraOptions);
        } else {
            api.dispatch(logOut(api.getState()));
        }
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
});