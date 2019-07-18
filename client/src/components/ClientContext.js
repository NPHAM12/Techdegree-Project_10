import React from 'react';

const ClientContext = React.createContext();
export const ClientConsumer = ClientContext.Consumer;
export const ClientProvider = ClientContext.Provider;

export default ClientContext;
