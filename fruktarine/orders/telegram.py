import os
import requests
import logging
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv('tel_bot')
chat_id = os.getenv('chat_id')  #Сообщение Диме
logger = logging.getLogger(__name__)


def get_update_telegram():
    # Функция проверяет наличие новых сообщений, с помощью неё можно найти id чата
    url = f"https://api.telegram.org/bot{TOKEN}/getUpdates"
    print(requests.get(url).json())


def send_by_telegram(message):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={chat_id}&text={message}"
    try:
        requests.get(url).json()
        logger.debug('Сообщение в телеграм успешно отправлено')
    except ConnectionError:
        logger.error('Сбой отправки сообщения в телеграм!')


if __name__ == '__main__':
    send_by_telegram('тест сообщения11')
