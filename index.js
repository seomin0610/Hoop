const { Client , Intents , Collection}  = require('discord.js')
const client = new Client({intents:32767})
const fs = require('fs')
const { prefix , token} = require('./config.json')
const { DiscordTogether } = require('discord-together')
client.discordTogether = new DiscordTogether(client);

client.once('ready',()=>{
    let number = 0
    setInterval(() => {
        const list = ["후프 봇 [-]", "Hoop bot [-]" , "made by gru#2747" , "깡통"]
        if(number == list.length) number = 0
        client.user.setActivity(list[number],{
            type:"PLAYING"
        })
        number++
    }, 5000) //몇초마다 상태메세지를 바꿀지 정해주세요 (1000 = 1초)
    console.log("봇이 준비되었습니다")
})

client.commands = new Collection()

const commandsFile = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for(const file of commandsFile){
    const command = require(`./commands/${file}`)
    client.commands.set(command.name , command)
}

client.on('messageCreate' , message=>{
    if(!message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift()
    const command = client.commands.get(commandName)
    if (!command) return
    try{
        command.execute(message,args)
    } catch (error) {
        console.error(error)
    }
})

client.on('messageCreate',message=>{
    if(message.content == `${prefix}유튜브`){
        const channel = message.member.voice.channel
        if(!channel) return message.reply("음성채널에 접속해주세요!")
        client.discordTogether.createTogetherCode(channel.id, 'youtube').then(invite =>{
            return message.channel.send(invite.code)
        })
    }
})

client.login(token)