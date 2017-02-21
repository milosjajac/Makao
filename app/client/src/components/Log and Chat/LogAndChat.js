import React from 'react';
import SplitterLayout from 'react-splitter-layout';
import {blueGrey300} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import Chat from '../Log and Chat/Chat';
import Log from  '../Log and Chat/Log';
import ChatInputField from '../Log and Chat/ChatInputField';
import UserStore from '../../stores/UserStore';
import io from 'socket.io-client';
import Auth from '../../Auth';

var socket;

class LogAndChat extends React.Component {
    constructor() {
        super();

        this.state = {
            me: UserStore.getState(),
            chatMessages: [],
        };

        this.handleSocketInit = this.handleSocketInit.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);
    }

    padLeft(txt, padLen = 2) {
        let pad = new Array(1 + padLen).join('0');
        return (pad + txt).slice(-padLen);
    }

    onNewChatMessage(message) {
        const time = new Date();
        let newMessage = {
            message: message,
            username: this.state.me.username,
            time: this.padLeft(time.getHours()) + ":" + this.padLeft(time.getMinutes()),
        };
        this.handleNewMessage(newMessage);
        document.getElementById('chat-input').value = null;

        socket.emit('send:message', newMessage);
    }

    handleNewMessage(newMessage) {
        const chatMessages = [...this.state.chatMessages, newMessage];
        this.setState({chatMessages: chatMessages});
    }

    handleSocketInit(messages) {
        const chatMessages = [...this.state.chatMessages, ...messages];
        this.setState({chatMessages: chatMessages});
    }

    componentDidMount() {
        socket = io('/chat');
        socket.emit('authenticate', {token: Auth.getToken()});
        socket.on('authenticated', () => {
            socket.emit('subscribe', this.props.creatorUsername, this.state.me.username);
            socket.on('init', this.handleSocketInit);
            socket.on('send:message', this.handleNewMessage);
        });
        socket.on('unauthorized', () => alert('nope'));
    }


    get styles() {
        return {
            container: {
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            },
            title: {
                margin: '5% 0',
                textAlign: 'center',
                fontSize: 14,
                color: blueGrey300,
            },
            chat: {
                alignSelf: 'flex-end',
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <span style={this.styles.title}>LOG</span>
                <Divider />
                <SplitterLayout vertical
                                percentage={true}
                                primaryMinSize={2} secondaryMinSize={20}>
                    <Log creatorUsername={this.props.creatorUsername}
                         socket={this.props.socket}/>
                    <Chat messages={this.state.chatMessages}
                          style={this.styles.chat}/>
                </SplitterLayout>

                <ChatInputField onEnter={(m) => this.onNewChatMessage(m)}/>
            </div>
        );
    }
}
export default LogAndChat;

LogAndChat.defaultProps = {};

LogAndChat.propTypes = {};