const stores = ['negociacoes'];
const version = 4;
const dbName = 'aluraframe';

let connection = null;
let close = null;

export class ConnectionFactory {

    constructor() {

        throw new Error("ConnectionFactory não pode ser instanciada");
    }

    static getConnection() {

        return new Promise((resolve, reject) => {

            let openRequest = window.indexedDB.open(dbName,version);

            openRequest.onupgradeneeded = e => {

                ConnectionFactory._createStores(e.target.result);

            };

            openRequest.onsuccess = e => {

                if(!connection) {
                    connection = e.target.result;
                    close = connection.close.bind(connection);
                    connection.close = () => {
                        throw new Error("Você não pode chamar close diretamente na conexão")
                    };
                }
                resolve(connection);
            };

            openRequest.onerror = e => {

                // logamos o objeto error
                console.log(e.target.error);

                // na rejeição da promise enviamos apenas o nome do erro
                reject(e.target.error.name);
            };

        });
    }

    static _createStores(connection) {

        stores.forEach(store => {

            if(connection.objectStoreNames.contains(store)) connection.deleteObjectStore(store);
            connection.createObjectStore(store, { autoIncrement: true });
        });

    }

    static closeConnection() {

        if(connection) {
            close();
            connection = null;
            close = null;
        }
    }
}
