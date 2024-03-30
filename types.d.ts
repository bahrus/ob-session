import {ActionOnEventConfigs} from 'trans-render/froop/types';

export interface EndUserProps{

}

export interface AllProps extends EndUserProps{

}

export type PP = Partial<AllProps>;

export type ProPP = Promise<PP>

export type PPE = [PP, ActionOnEventConfigs<AllProps, Actions>];

export interface Actions{
    
}