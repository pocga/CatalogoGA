FROM mongo

COPY seed-data.json /seed-data.json
CMD mongoimport --host mongodb --db producto --collection productos --type json --file /seed-data.json --jsonArray
