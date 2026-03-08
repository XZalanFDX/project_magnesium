const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const query = `
      INSERT INTO adatfelvételilap (nev, telefon, email)
      VALUES ($1, $2, $3)
    `;

    const values = [
      data.teljes_nev,
      data.tel_szam,
      data.email
    ];

    await client.query(query, values);
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Sikeres mentés!" })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Adatbázis hiba történt." })
    };
  }
};