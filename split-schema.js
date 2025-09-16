const fs = require('fs');
const path = require('path');

// Path to your Drizzle schema file
const schemaFile = path.join(__dirname, 'drizzle', 'schema.ts');

// Folder where split table files will be created
const outputDir = path.join(__dirname, 'src', 'db', 'schema');

// Make sure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read schema.ts
const schemaContent = fs.readFileSync(schemaFile, 'utf-8');

// Match each table export: export const table_name = mysqlTable(...)
const tableRegex = /export const (\w+) = mysqlTable\(([\s\S]*?)\);/g;

let match;
const tables = [];

while ((match = tableRegex.exec(schemaContent)) !== null) {
  const tableName = match[1];
  const tableBody = match[2];

  const filePath = path.join(outputDir, `${tableName}.ts`);
  const fileContent =
    `import { mysqlTable, mysqlEnum, serial, varchar, int, text, boolean } from 'drizzle-orm/mysql-core';\n\n` +
    `export const ${tableName} = mysqlTable(${tableBody});\n`;

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  tables.push(tableName);
  console.log(`Created: ${tableName}.ts`);
}

const indexContent = tables.map((t) => `export * from './${t}';`).join('\n');
fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent, 'utf-8');

console.log('\nAll tables split successfully!');
