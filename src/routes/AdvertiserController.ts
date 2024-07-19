import { RowDataPacket } from 'mysql2';
import { Body, Post, Route } from 'tsoa';
import { DB } from '../utility/DB';


/**
 * Un annonceur
 */
@Route("/advertiser")
export class AdvertiserController {

  /**
   * Récupérer une page d'annonceurs
   */
  @Post()
  public async getAdvertisers(
    @Body() body: {
      columns: string[];
      name?: string;
    }
  ): Promise<any> {
    const db = DB.Connection;
    
    // Vérification et nettoyage des noms de colonnes
    const safeColumns = body.columns.filter(column => 
      /^[a-zA-Z0-9_]+$/.test(column)
    ).join(', ');
    
    if (safeColumns.length === 0) {
      throw new Error('No valid columns specified');
    }

    let sql = 'SELECT ?? FROM advertiser';
    let params: any[] = [safeColumns.split(', ')];

    if (body.name) {
      sql += ' WHERE name = ?';
      params.push(body.name);
    }

    const [data] = await db.query<RowDataPacket[]>(sql, params);
    
    return data;
  }
}
