var DATA = function() {
    this.db = window.sqlitePlugin.openDatabase({name: "retroxel.db"});

    /* Check the version, and create/update depending on the version */
    let version = 0;
    this.db.transaction(function(tx) {
        tx.executeSql("SELECT data FROM settings LIMIT 1", function(tx, rs) {
            if (rs.rows.length == 1) {
                version = parseInt(rs.rows.item(0)['data']);
                /* Create tables */
            }
        });

        /*
        tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='settings';", function(tx, rs) {
            if (rs.rows.length == 0) {
            }
        });
        */

        tx.executeSql("CREATE TABLE IF NOT EXISTS settings (id varchar(255) primary key, data text");
        tx.
    });
};

DATA.version = 1;

DATA.prototype.loadConfig = function() {

};

DATA.prototype.saveConfig = function() {

};

DATA.prototype.fetchPuzzle = function() {

db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS test_table');
    tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

    tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100], function(tx, res) {
        console.log("insertId: " + res.insertId + " -- probably 1");
        console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

    }, function(e) {
        console.log("ERROR: " + e.message);
    });
}); 

};

/*
myDB.transaction(function(transaction) {
    transaction.executeSql('CREATE TABLE IF NOT EXISTS phonegap_pro (id integer primary key, title text, desc text)', [],
            function(tx, result) {
                alert("Table created successfully");
            },
            function(error) {
                alert("Error occurred while creating the table.");
            });
});
*/

DATA.prototype.createTable = function(table) {

    <
