import { LitElement } from "lit";
import "./elements.cardmeister.min";
export declare type ICardSuit = 1 | 2 | 3 | 4;
export declare type ICardRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export interface ICard {
    card: [ICardSuit, ICardRank];
    value: string;
}
export interface ICardClick {
    card: string;
    index: number;
}
export declare class CardHand extends LitElement {
    cards: string;
    interactive: boolean;
    hover: number;
    selected: number;
    update(changedProperties: any): void;
    render(): import("lit-html").TemplateResult<1>;
    private _onClickCard;
    private _onMouseOver;
    private _onMouseOut;
    static styles: import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "card-hand": CardHand;
    }
}
