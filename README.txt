1. Install packages Using "npm install". It fetches all the dependencies into node_modules folder
2. Run the application using "npm run start" command -- starts gapi as well as webpack server (webpack server is started at port 8080)

3. To deploy to production: 
        gcloud preview app deploy app.yaml --project the-tasty-samosa --version web --verbosity debug

4. To deploy to development:
        gcloud preview app deploy app.yaml --project the-tasty-samosa --version web-dev --verbosity debug
