import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class MigrationName1620000000000 implements MigrationInterface {

  // `up` method for applying the migration
  public async up(queryRunner: QueryRunner): Promise<void> {
    
    // Create 'users' table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid', // UUID to match your User entity
            isPrimary: true,
            isGenerated: false, // We use manually generated UUIDs
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['USER', 'ADMIN'],
            default: "'USER'",
          },
          {
            name: 'subscription',
            type: 'boolean',
            default: false,
          },
          {
            name: 'active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'refToken',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      })
    );

    // Create 'videos' table
    await queryRunner.createTable(
      new Table({
        name: 'videos',
        columns: [
          {
            name: 'id',
            type: 'uuid', // UUID to match your Video entity
            isPrimary: true,
            isGenerated: false, // We use manually generated UUIDs
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'hlsUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'access',
            type: 'enum',
            enum: ['free', 'paid'],
            default: "'free'",
          },
          {
            name: 'viewCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'public_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      })
    );

    // Create 'analytics' table
    await queryRunner.createTable(
      new Table({
        name: 'analytics',
        columns: [
          {
            name: 'id',
            type: 'uuid', // UUID to match your Analytics entity
            isPrimary: true,
            isGenerated: false, // We use manually generated UUIDs
          },
          {
            name: 'views',
            type: 'int',
            default: 0,
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'videoId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      })
    );

    // Add foreign keys for 'analytics' table to reference 'users' and 'videos'
    await queryRunner.createForeignKey(
      'analytics',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'analytics',
      new TableForeignKey({
        columnNames: ['videoId'],
        referencedTableName: 'videos',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
  }

  // `down` method for reverting the migration
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Get the 'analytics' table, and check if it exists
    const analyticsTable = await queryRunner.getTable('analytics');
    
    // Only proceed if 'analyticsTable' is defined
    if (analyticsTable) {
      const foreignKeys = analyticsTable.foreignKeys;
      
      // Drop foreign keys first
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey('analytics', foreignKey);
      }

      // Drop the 'analytics' table
      await queryRunner.dropTable('analytics');
    }

    // Drop the 'videos' and 'users' tables in reverse order
    await queryRunner.dropTable('videos');
    await queryRunner.dropTable('users');
  }
}
