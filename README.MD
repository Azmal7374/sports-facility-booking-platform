# Instruction This Project Run Locally

### Step 1: run this command
   1. npm init -y
### Step 2: run this command
   1. npm install express
   2. npm install mongoose --save
   3. npm install typescript --save-dev
   4.  npm i --save-dev @types/node
   5.  npm i --save-dev @types/express
   6.  npm i cors
   7.  npm i --save-dev @types/cors
   8.  npm i dotenv
   9.  npm i jsonwebtoken
   10. npm i moment

### Step 3: run this command 
   1. tsc -init
   2. add tsconfig.json file
    {
      
      "include": ["src"], // which files to compile

      "exclude": ["node_modules"], // which files to skip
    }

### Step 4: install and setup eslint
   
   1. npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev

   2. run the following command: npx eslint --init
   3. Then ask some question and select the correct answer:
    -To check syntax and find problems
    -Javascript modules(import/export)
    -None of these
    -typescript
    -node

### Step 5: install and setup Prettier
   1. npm install --save-dev prettier
   2. create .prettierrc.json file
   3. add  .prettierrc.json:
     
   {
    "semi": true,  
    "singleQuote": true 
   
  }

   4. avoide eslint and prettier conflict:
      npm install --save-dev eslint-config-prettier

### Step 6: run the following command:
   1. npm i ts-node-dev --save-dev

### Step 7: run the following command:Scehema validation useing zod/joi
    1. npm i joi
    2. npm i zod