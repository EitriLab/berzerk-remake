export class Placar {
  public static pontos: number = 0;
  public static moedas: number = 0; // Guarda as moedas para gastar na loja

  // Upgrades que serão comprados na loja e aplicados ao jogador
  public static upgradeVelocidade: number = 0; 
  public static vidaMaxima: number = 3;       

  // Variável de controle global para congelar as ações do jogo de fundo
  public static jogoPausado: boolean = false; 
}
