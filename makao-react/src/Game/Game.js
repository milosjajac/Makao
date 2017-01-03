/**
 * Created by Masa on 22-Dec-16.
 */
import React from 'react';
import CardComponent from '../Card/CardComponent';
import CardSet from '../Card/CardSet';
import Card from '../Card/Card';
import Talon from './Talon';
import Opponents from './Opponents';
import _ from 'lodash';
import LinearProgress from 'material-ui/LinearProgress';


class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            dimensions: {
                userCardsWidth: 700,
                userCardsHeight: 250,
                talon: 270,
                opponents: 150,
            },
            players: [
                {id: 1, name: 'Masa', cardNumber: '10'},
                {id: 2, name: 'Jajac', cardNumber: '13'},
                {id: 3, name: 'Nikolica', cardNumber: '5'},
                {id: 4, name: 'Nemanja', cardNumber: '7'},
                {id: 5, name: 'Darko', cardNumber: '8'},
                {id: 5, name: 'Darko', cardNumber: '8'},
            ],
            playerOnMoveId: 2,
            userId: 1,
            myCards: [
                new Card("spades", "2"),
                new Card("spades", "7"),
                new Card("diamonds", "1"),
                new Card("spades", "12"),
                new Card("spades", "13"),
                new Card("spades", "1"),
                new Card("diamonds", "2"),
                new Card("diamonds", "13"),
                new Card("clubs", "1"),
                new Card("clubs", "2"),
                new Card("clubs", "10"),
                new Card("clubs", "14"),
                new Card("hearts", "3"),
                new Card("hearts", "12"),
                new Card("spades", "2"),
                new Card("spades", "7"),
                new Card("diamonds", "1"),
                new Card("spades", "12"),
                new Card("spades", "13"),
                new Card("spades", "1"),
                new Card("diamonds", "2"),
                new Card("diamonds", "13"),
                new Card("clubs", "1"),
                new Card("clubs", "2"),
                new Card("clubs", "10"),
                new Card("clubs", "14"),
                new Card("hearts", "3"),
                new Card("hearts", "12"),
            ],
            pile: [],
        };


        this.handleResize = this.handleResize.bind(this);
        this.handleDraw = this.handleDraw.bind(this);

    }

    playMove(playerId, card) {
        if (playerId === this.state.userId) {
            const myCards = this.state.myCards.slice();
            myCards.splice(myCards.indexOf(card), 1);
            this.setState({
                myCards: myCards,
            })
        }
        const players = this.state.players.slice();
        players.find((player) => player.id === playerId).cardNumber--;
        const pile = this.state.pile.slice();
        pile.push(card);
        this.setState({
            players: players,
            pile: pile,
        })

    }

    handleDraw() {
        alert("vucem kartu");
    }

    handleResize() {
        const w = document.documentElement.clientWidth;
        const h = document.documentElement.clientHeight;

        let dimensions = {
            userCardsWidth: 700,
            userCardsHeight: 250,
            talon: 270,
            opponents: 150,
        };
        if (w < 1000) {
            dimensions.userCardsWidth = w * 7 / 10;
            dimensions.talon = w * 270 / 1000;
            dimensions.opponents = w * 15 / 100;
        }
        if (w < 550) {
            dimensions.userCardsWidth = w * 0.95;
        }
        if (h < 750) {
            dimensions.userCardsHeight = h * 250 / 750;
            dimensions.talon = h * dimensions.talon / 750;
            dimensions.opponents = h * dimensions.opponents / 750;
        }
        console.log(dimensions.talon);
        this.setState({dimensions: dimensions});
    }

    componentDidMount() {
        this.playMove(1, this.state.myCards[0]);
        this.playMove(2, new Card("clubs", "9"));
        window.addEventListener("resize", this.handleResize);
    }

    componentWillMount() {
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    get styles() {
        const talonMargin = this.state.dimensions.talon / 40;

        return {
            container: {
                position: 'relative',
            },
            myCards: {},
            opponents: {},
            talon: {
                marginBottom: talonMargin + '%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            },
            userCardsTalon: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center'
            },
            userContainer: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center'
            },
            timer: {
                height: 7,
            }
        }
    }

    /*<div style={this.styles.myCards}>
     <CardSet width={700} height={310} cards={this.state.myCards} />
     </div>
     <div style={this.styles.myCards}>
     <CardSet width={100/3*2+100} height={100} cardNumber={100} back />
     </div>
     <div style={this.styles.myCards}>
     <CardSet width={500} height={310} cardNumber={5} back />
     </div>
     <div>
     <Talon cardHeight={310} card={this.state.pile.slice(-1)[0]}/>
     </div>*/

    handleCardClick(card) {
        this.playMove(this.state.userId, _(this.state.myCards).find(card));
    }

    render() {
        const players = this.state.players.slice();
        const playersWithoutUser = _.remove(players, (p) => p.id !== this.state.userId);
        return (
            <div style={this.styles.container}>
                <div style={this.styles.opponents}>
                    <Opponents playerHeight={this.state.dimensions.opponents}
                               players={playersWithoutUser}
                               playerOnMoveId={this.state.playerOnMoveId}/>
                </div>
                <div style={this.styles.userCardsTalon}>
                    <div style={this.styles.talon}>
                        <Talon cardHeight={this.state.dimensions.talon}
                               card={this.state.pile.slice(-1)[0]}
                               onClick={() => this.handleDraw()}/>
                    </div>
                    <div style={this.styles.userContainer}>
                        <div style={this.styles.myCards}>
                            <CardSet
                                onClick={(card) => this.handleCardClick(card)}
                                width={this.state.dimensions.userCardsWidth}
                                height={this.state.dimensions.userCardsHeight}
                                cards={this.state.myCards}/>
                        </div>
                    </div>
                </div>
            </div>
        )
            ;
    }
}

export default Game;