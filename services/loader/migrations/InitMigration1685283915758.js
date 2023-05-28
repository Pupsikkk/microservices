module.exports.InitMigration1685283915758 = class InitMigration1685283915758 {
    async up(queryRunner){
        await queryRunner.query(
      `CREATE TABLE \`cities\` (
          \`id\` int NOT NULL AUTO_INCREMENT, 
          \`cityName\` varchar(20) NOT NULL, 
          \`region\` varchar(20) NOT NULL, 
          \`country\` varchar(20) NOT NULL, 
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`cities\` ADD UNIQUE INDEX \`IDX_bc60994d856300ee4e4b08f153\` (\`cityName\`)`,
    );
  }

    async down(queryRunner){
        await queryRunner.query(`DROP TABLE \`cities\``);
    }
}