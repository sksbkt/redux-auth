import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../authSlice";
import styles from './Welcome.module.scss'
import { Link } from "react-router-dom";
function Welcome() {
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);

    const welcome = `welcome${user ? ` ${user}` : ''}!`;
    const tokenAbbr = `${token.slice(0, 9)}...`;


    const content = (
        <section className={styles.welcome}>
            <h1>{welcome}</h1>
            <p>Token: {tokenAbbr}</p>
            <p>
                <Link to='/usersList'>
                    Go to the users list
                </Link>
            </p>
        </section>
    );
    return content;
}

export default Welcome;
