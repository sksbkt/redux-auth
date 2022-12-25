import React, { useEffect, useRef, useState } from "react";
import styles from './Login.module.scss'
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../authSlice";
function Login() {
    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();


    useEffect(() => {
        userRef.current?.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const userData = await login({ user, pwd }).unwrap();
            console.log(userData);
            dispatch(setCredentials({ ...userData, user }));
            setUser('');
            setPwd('');
            navigate('/welcome');

        } catch (err: any) {
            //? orginalStatus?!
            if (!err?.message) {
                setErrMsg('No server response');
            } else if (err.response?.status === 400) {
                setErrMsg('Username or password missing');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login failed');
            }
            errRef.current?.focus();
        }
    }


    const handleUserInput = (e: any) => setUser(e.target.value);

    const handlePwdInput = (e: any) => setPwd(e.target.value);

    const content = isLoading
        ? <h1>Loading...</h1>
        : (
            <section className={styles.login}>
                <p ref={errRef} className={errMsg ? styles.errMsg : styles.offScreen}>
                    {errMsg}
                </p>
                <h1>Employee login</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        ref={userRef}
                        value={user}
                        onChange={handleUserInput}
                        autoComplete='off'
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={pwd}
                        onChange={handlePwdInput}
                        required
                    />
                </form>
                <button>Sing in</button>
            </section>
        );

    return content;
}

export default Login;
