/** Un párrafo se escribe como lista de fragmentos para poder resaltar partes del texto. */
export type Fragmento = string | { fuerte: string };

export type Parrafo = Fragmento[];
