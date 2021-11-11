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


api_id = sys.argv[1]
api_hash = sys.argv[2]
phone = sys.argv[3]
session_file = phone
# having an id for the group
group_id = sys.argv[4]
message = sys.argv[5]
# write to group using telethon api

# content of the automatic reply
# print(spintax.spin("{Simple|Easy} {example|demonstration}"))

# create a sender list to check if user already send private message or mention

client = TelegramClient(session_file, api_id, api_hash, sequential_updates=False)
# change username using telethon

async def main():
    await client.start(phone)
    # having a group id, get channel entity
    group = await client.get_entity(group_id)
    await client.send_message(group, message)
    await client.disconnect()

with client:
    client.loop.run_until_complete(main())
