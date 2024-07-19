import { Body, Post, Route } from 'tsoa';
import { ApiError } from "../utility/Error/ApiError";
import { ErrorCode } from "../utility/Error/ErrorCode";



@Route("/auth")
export class AuthController {

  /**
   * Crée un nouvel utilisateur
   * @returns L'ID de l'utilisateur crée
   * @param body 
   */
  @Post("/signup")
  public async signup(  
    @Body() body: {
      email: string;
      password: string;
    }
  ): Promise<{ userId: number }> {    

    // @todp Créer un nouvel utilisateur

    throw new ApiError(ErrorCode.InternalError, 'internal/not-implemented', 'Not implemented');
  }


  /**
   * Connexion d'un utilisateur. Devrait générer un JWT si l'utilisateur existe.
   * @param body 
   * @returns 
   */
  @Post("/login")
  public async login(  
    @Body() body: {
      email: string;
      password: string;
    }
  ): Promise<{ 
    token: string;    
  }> {    
   
    // @todo Vérifier l'existence d'un utilisateur
    // @todo Vérifier que c'est le bon mot de passe
    // @todo Générer un JWT avec un payload

    /** 
     * Exemple du payload
     * {
     *    "userId": 134,
     *    "issuer": "api-auth",
     *    "audience": "api-access"
     * }
     */
    
    throw new ApiError(ErrorCode.InternalError, 'internal/not-implemented', 'Not implemented');
  }

}

// TODO: Complétez les endpoints pour le renouvellement du `access token`. 
// - si le demandeur recoit une erreur de type 'expired', il devrait renvoyer son renew-token à un endpoint /auth/renew (par exemple)
// - si le renew-token est toujours valable, on peut re-emettre un access token

