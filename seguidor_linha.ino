#include <L298NX2.h>

#define ENA 10  // ENA precisa estar em uma porta PWM
#define IN1 9
#define IN2 8
#define IN3 7
#define IN4 6
#define ENB 5  // ENB precisa estar em uma porta PWM

/* Criamos um objeto de controle dos motores.           */
L298NX2 motores(ENA, IN1, IN2, ENB, IN3, IN4);

/* Define os pinos 2 e 3 para os sensores IR            */
#define Pino_Sensor_Direita 3
#define Pino_Sensor_Esquerda 2

/* Variáveis para armazenar os dados dos sensores.      */
int Sensor_Direita, Sensor_Esquerda;


void setup() {
  /* Inicia com os motores parados.                     */
  motores.stop();
  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
}

void loop() {
  /* Sensores realizam a leitura                        */
  Sensor_Direita = digitalRead(Pino_Sensor_Direita);
  Sensor_Esquerda = digitalRead(Pino_Sensor_Esquerda);

  /* Nenhum sensor detectou a linha                     */
  if ((Sensor_Esquerda == 0) && (Sensor_Direita == 0)) {
    motores.setSpeed(170); /* Define a velocidade dos motores */
    motores.forward();     /* Robô move para frente           */
  }

  /* Sensor da direita det ectou a linha */
  if ((Sensor_Esquerda == 0) && (Sensor_Direita == 1)) {
    motores.setSpeed(150); /* Define a velocidade dos motores */

    motores.forwardB(); /* Robô vira à direita                */
    motores.backwardA();
  }

  /* Sensor da esquerda detectou a linha                      */
  if ((Sensor_Esquerda == 1) && (Sensor_Direita == 0)) {
    motores.setSpeed(150); /* Define a velocidade dos motores */

    motores.forwardA(); /* Robô vira à esquerda               */
    motores.backwardB();
  }

  /* Os dois sensores detectaram a linha                      */
  if ((Sensor_Esquerda == 1) && (Sensor_Direita == 1)) {
    motores.stop(); /* Robô permanece parado                  */
  }
}
