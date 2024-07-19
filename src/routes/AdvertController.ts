import { Get, Query, Route, Security } from 'tsoa';
import { IAdvert } from '../model/Advertising/IAdvert';
import { IIndexResponse } from '../types/IIndexQuery';
import { Crud } from '../utility/Crud';

const READ_COLUMNS = ['advertId', 'advertiserId', 'price'];

/**
 * Une annonce
 */
@Route("/advert")
@Security('jwt')
export class Advert {

  /**
   * Récupérer une page d'annonces
   */
  @Get()
  public async getAdverts(
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,    
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,    
  ): Promise<IIndexResponse<IAdvert>> {
    return Crud.Index<IAdvert>({
      query: { page, limit }, 
      table: 'advert', 
      columns: READ_COLUMNS
    }); 
  }
}
