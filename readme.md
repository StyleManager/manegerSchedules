 # API autodocodumentável
  Requisitos:
  1- Criar um sistema básico onde os clientes possam visualizar os horários disponíveis e marcar agendamentos.
  - agendamentos para o dia, só podem acontecer com horarios 6h de antecedencia.
  - banco de dados (Marcar agendamentos até 1 semena à frente) 
  - Após fazer o agendamento o cliente recebera por email, uma validação para confirmar (Só depois o agendamento é salvo no banco)

  2- Os prestadores de serviço devem receber notificações automáticas sobre novos agendamentos.
  - notificações por email da confirmação do agendamento.
  - Agenda completa do dia (Agenda completa do dia). 

  3- Deve haver uma interface simples para gerenciar e cancelar compromissos.
  - cancelar agendamento - capturar o email (criar um perfil), caso o email cancele 3 cancelamentos recebe um banimento de 1 semana
  - interface que mostre todos os agendamentos de acordo com a data.

# Biblioteca para datas
npm i dayjs

# Biblioteca para encio de emails
npm i nodemailer