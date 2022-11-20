import dotenv from 'dotenv'
import pg from 'pg'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })


export default async function makeDb() {
    const pool = new pg.Pool({
        user: process.env.USER_DB,
        database: process.env.DATABASE_DB,
        password: process.env.PASSWORD_DB,
        port: process.env.DATABASE_PORT,
        host: process.env.HOST_DB,
    })
    return pool
}


