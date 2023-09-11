import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class AppService {
  private responseServiceEquifax = { informe:"", requestid:"" };

  async getEquifax(): Promise<string> {
    const requestId = this.generateRequestId();

    try {
      const postData = {
        informe: '1',
        requestid: requestId,
      };

      console.log('El id generado es: ' + postData.requestid);

      // Realiza la llamada POST y espera a que termine
      await axios.post('http://localhost:3001/api/asincequifax', postData);

      // Ahora, espera hasta que el requestId sea igual al generado en postHookEquifax
      const start = Date.now();
      while (this.responseServiceEquifax.requestid == "") {
        console.log("El id sigue estando vacio: " + this.responseServiceEquifax.requestid);

        // Espera un breve período antes de volver a verificar
        //await new Promise((resolve) => setTimeout(resolve, 100));
      }



      console.log('El id enviado desde el método asincrónico se lleno con: ' + this.responseServiceEquifax.requestid);
      console.log('El id en el ASBRIDGE es: ' + this.responseServiceEquifax.requestid);

      if(requestId == this.responseServiceEquifax.requestid)
      {
        console.log("Los ids son iguales");
        const getResponse = {
          message: 'Estado Equifax Ok',
          data: 'Ok', // Puedes incluir datos de la respuesta POST si es necesario
        };
        return JSON.stringify(getResponse);
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error al realizar la solicitud POST:', error);
      throw error;
    }
  }

  getMalla(): string {
    return 'Estado Malla Ok';
  }

  getAchef(): string {
    return 'Estado Achef Ok';
  }

  postHookEquifax(data: any): Promise<string> {
    this.responseServiceEquifax = data;
    console.log("Recibe datos el webhook A/S Bridge :" + "Informe: " + this.responseServiceEquifax.informe + ", " + "requestid: " + this.responseServiceEquifax.requestid);
    // Devuelve una promesa que resuelve con un mensaje de éxito.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Datos procesados exitosamente');
      }, 1000); // Simulamos una operación asincrónica que toma 1 segundo.
    });
  }

  // Función para generar un identificador único de solicitud
  private generateRequestId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
