import time
import json
from telethon import TelegramClient, events
from datetime import timedelta
import string
import random
from telethon.tl.functions.account import UpdateUsernameRequest
from telethon.tl.functions.account import UpdateProfileRequest

# import spintax
import warnings
import sys
import socks


# use your username if unsure
password = 'YOUR_PASSWORD'  # two step verification
link = 'bit.ly/bibi19'
idTxt = 'account1.txt'
username = sys.argv[1]
api_id = sys.argv[2]
api_hash = sys.argv[3]
phone = sys.argv[4]
session_file = phone


# content of the automatic reply
# print(spintax.spin("{Simple|Easy} {example|demonstration}"))

# create a sender list to check if user already send private message or mention
senderList = []
botTrigger = ['fake', 'bot']
uniqueUser = []
timesCalledFaked = []
client = TelegramClient(session_file, api_id, api_hash, sequential_updates=False)
# change username using telethon


async def main():
    me = await client.get_me()
    print('Logged in as: ' + me.username)
    try:
        await client(UpdateUsernameRequest(username))
        await client(UpdateProfileRequest(
    first_name= first_name,
    last_name = ''
))
        client.disconnect()
    except Exception as e:
        print(e)

with client:
    client.loop.run_until_complete(main())

if __name__ == '__main__':

    # Create the client and connect
    # use sequential_updates=True to respond to messages one at a time



    client.start(phone, password)
    #client.run_until_disconnected()
    print(time.asctime(), '-', 'Closed!')


async def changeUsername(username):
    me = await client.get_me()
    print('Logged in as: ' + me.username)
    try:
        await client(UpdateUsernameRequest(username))
        await client(UpdateProfileRequest(
    first_name= username,
    last_name = ''
))
        client.disconnect()
    except Exception as e:
        print(e)

