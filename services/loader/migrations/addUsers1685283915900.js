module.exports.AddUsers1685283915900 = class AddUsers1685283915900 {
    async up(queryRunner){
        await queryRunner.query(
      `CREATE TABLE \`users\` (
          \`id\` int NOT NULL AUTO_INCREMENT, 
          \`firstName\` varchar(20) NOT NULL, 
          \`lastName\` varchar(20) NOT NULL, 
          \`email\` varchar(20) NOT NULL, 
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_bc60994d856300ee4e4b08f154\` (\`email\`)`,
    );
  }

    async down(queryRunner){
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}