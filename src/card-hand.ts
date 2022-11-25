import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import "./elements.cardmeister.min";

export type ICardSuit = 1 | 2 | 3 | 4;
export type ICardRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface ICard {
  card: [ICardSuit, ICardRank];
  value: string;
}
export interface ICardClick {
  card: string;
  index: number;
}

// SHRC s3,h3,r3,c3

const suites: string[] = ["s", "h", "r", "c"];

function getSuite(text: string): ICardSuit {
  const suite = suites.indexOf(text);
  if (suite > -1 && suite < 4) {
    return suite as ICardSuit;
  }
  return 1;
}
function getRank(text: string): ICardRank {
  let rank:number = 0;
  if (text === 't') {
    rank = 10
  }
  if (text === 'j') {
    rank = 11
  }
  if (text === 'q') {
    rank = 12
  }
  if (text === 'k') {
    rank = 13
  }
  if (text === 'a') {
    rank = 14
  }
  if (!rank) {
    rank = parseInt(text);
  }
  
  if (rank > 0 && rank < 15) {
    return rank === 14 ? 1 : (rank as ICardRank);
  }
  return 1;
}

function parseCards(text: string): ICard[] {
  const list = text.split(",");
  let cards: ICard[] = [];
  list.forEach((item) => {
    const clean = item.toLocaleLowerCase().trim();
    if (clean.length > 1) {
      const suite = getSuite(clean.substring(0, 1));
      const rank = getRank(clean.substring(1).toLocaleLowerCase());
      cards.push({
        card: [suite, rank],
        value: item,
      });
    }
  });
  return cards;
}

@customElement("card-hand")
export class CardHand extends LitElement {
  @property({
    type: String
  })
  cards = "";

  @property({ type: Boolean })
  interactive = false;

  @property({ type: Number })
  hover = -1;

  @property({ type: Number })
  selected = -1;

  update(changedProperties:any) {
    if (changedProperties.has('cards')) {
      this.hover = -1;
      this.selected = -1;
    }
    super.update(changedProperties);
  }

  render() {
    const cards = parseCards(this.cards);
    const even = cards.length % 2 === 0;
    const half = cards.length / 2;
    const middle = even ? half - 0.5 : Math.ceil(half - 1);
    const classesContainer = {
      container: true,
      isFew: cards.length < 6,
    };
    return html`
      <div class="${classMap(classesContainer)}">
        ${cards.map((card, i) => {
          const offset = i - middle;
          const classes = {
            cardBtn: true,
            cardBtnInteractive: this.interactive,
            selected: i === this.selected,
          };
          return html`<button
            class="${classMap(classes)}"
            @click=${() => this._onClickCard({ index: i, card: card.value })}
            @mouseover="${() => this._onMouseOver(i)}"
            @mouseout="${() => this._onMouseOut()}"
            style="transform: rotate(calc(${offset}*var(--deg))) translateX(calc(${offset}*var(--distance))) translateY(calc(-1*var(--distance)));"
          >
            <div>
              <card-t
                suit="${card.card[0]}"
                rank="${card.card[1]}"
                cardcolor="${this.hover === i || this.selected === i
                  ? "yellow"
                  : "white"}"
              ></card-t>
            </div>
          </button>`;
        })}
      </div>
    `;
  }

  private _onClickCard(detail: ICardClick) {
    if (!this.interactive) {
      return;
    }
    const selected = detail.index === this.selected;
    if (!selected) {
      this.selected = detail.index;
    }
    const options = {
      detail: {
        ...detail,
        action: selected ? "confirm" : "select",
      },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("cardSelected", options));
  }
  private _onMouseOver(index: number) {
    if (!this.interactive) {
      return;
    }
    this.hover = index;
  }
  private _onMouseOut() {
    if (!this.interactive) {
      return;
    }
    this.hover = -1;
  }

  static styles = css`
    :host {
      padding: 1rem;
      aspect-ratio: 13/9;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      position: relative;
      width: 100%;
      --deg: 5deg;
      --width: 35%;
      --distance: 5%;
    }
    @media (min-width: 640px) {
      .container {
      }
    }
    .isFew {
      --deg: 10deg;
    }
    .cardBtn {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: calc(var(--width) / 2 * -1);
      margin-top: calc((var(--width) / 18 * 25) / 2 * -1);
      padding: 0;
      border: none;
      background: none;
      display: block;
      width: var(--width);
      aspect-ratio: 18/25;
      transform-origin: bottom;
      -webkit-appearance: none;
      -moz-appearance: none;
    }
    .cardBtn > img {
      display: block;
    }
    .cardBtnInteractive:hover {
      cursor: pointer;
    }
    .cardBtnInteractive.selected > div,
    .cardBtnInteractive:hover > div {
      transform: translateY(calc(-2 * var(--distance)));
      transition: transform 200ms ease-in;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "card-hand": CardHand;
  }
}
