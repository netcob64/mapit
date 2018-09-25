const typeCache: { [label: string]: boolean } = {};
export function type<T>(label: T | ""): T {
  if (typeCache[<string>label]) {
    throw new Error(`Action type "${label}" is not unique"`);
  }

  typeCache[<string>label] = true;

  return <T>label;
}
export interface Action {
    type: string;
    payload?: any;
}
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'keepHtml', pure: false })
export class EscapeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(content) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}


@Pipe({  name: 'enumToArray', pure: true})
export class EnumToArrayPipe implements PipeTransform {
  transform(data) {
    return Object.keys(data);
  }
}

/*
export function EnumToArray(enumName) : Array<string[]> {
  console.log('EnumToArray => ');

  let arr : Array<string[]> = [];
  for (var k in enumName) {
    if(isNaN(Number(k]) === false){
    let a = [k, enumName[k]];
    arr=arr.concat(a);}
  }
  console.log(arr);
  return arr;
 
    return Object.keys(enumName)
        .filter(value => isNaN(Number(value)) === false)
        .map(key => [key, enumName[key]]);
 
  } */