var DATA = function() {
    this.isLoaded = false;
};

DATA.version = 1;

DATA.prototype.init = function() {
    this.db = window.sqlitePlugin.openDatabase({name:"retroxel.db", location:'default'});

    /* Make sure the database is at the latest version */
    let version = 0;
    this.db.transaction(function(tx) {
        tx.executeSql("SELECT data FROM settings WHERE id == 'version' LIMIT 1", function(tx, rs) {
            console.log("OUI");
            if (rs.rows.length == 1) {
                version = parseInt(rs.rows.item(0)['data']);
            }
        });

        if (version < DATA.version) {
            for (let v=version; v<=DATA.version; v++) {
                switch (v) {
                    case 1:
                        tx.executeSql("CREATE TABLE IF NOT EXISTS settings (id varchar(255) primary key, data text");
                        console.error("CREATING THE DATABASE");
                        break;
                }
            }

            DATA.saveSetting('version', DATA.version);
        }
    });

    this.isLoaded = true;
};

DATA.prototype.loadConfig = function() {

};

DATA.prototype.saveConfig = function() {

};

DATA.prototype.saveSetting = function(key, data) {

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
