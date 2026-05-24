import { createClient } from '@libsql/client';

const turso = createClient({
  url: 'libsql://xpitiendacatalog-xpitiendas.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzkwNjg1NTQsImlkIjoiMDE5ZTM4YmMtYWEwMS03M2JhLThhY2MtNmU5MjRkZTk0MTA4IiwicmlkIjoiNjg1ZGE0YmEtNWY1Ny00NGFkLWE3MTAtNjI5NTY3NDljYjkyIn0.spCX8K7W3ptEx4ZZD9RRkuzvHF0tg4Zxwg9HBG2g6q9l0i-uuPUfH_Gy1-VmgWM5r47VYMd8HneVO3z2g6zuAA'
});

const result = await turso.execute('SELECT name, image_url FROM catalog');
console.log(JSON.stringify(result.rows, null, 2));
