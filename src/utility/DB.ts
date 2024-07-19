import mysql, { Pool } from 'mysql2/promise';

/** Wrapper de la connexion à la SGBDR.
 * On stock une seule référence à la connexion-pool, et on va systématiquement
 * récupérer cette référence pour nos requêtes.
 */
export class DB {

  // Variable "static": une seule instance pour toutes les instances de la classe DB
  private static POOL: Pool|undefined;

  /**
   * Récupérer ou créer la connexion-pool.
   */
  static get Connection(): Pool {
    if (!this.POOL) {
      let port: any = undefined;
      if (process.env.DB_PORT) {
        port = parseInt(process.env.DB_PORT);
      }
        
      this.POOL = mysql.createPool({
        port: port,
        host: process.env.DB_HOST || 'dbms',
        user: process.env.DB_USER || 'api-dev',
        database: process.env.DB_DATABASE || 'school',
        password: process.env.DB_PASSWORD || 'api-dev-password', 
        multipleStatements: true 
      });
    }

    return this.POOL;
  }

  static async Close() {
    if (this.POOL) {
      await this.POOL.end();
      this.POOL = undefined;
    }
  }

}