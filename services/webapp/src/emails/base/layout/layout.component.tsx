import React, { ReactNode } from 'react';
import { Image } from '../image';
import { Container, Table, Tr, Td, Text, Title } from './layout.styles';

export interface LayoutProps {
  title: string | ReactNode;
  text: string | ReactNode;
  children?: ReactNode;
}

export const Layout = ({ title, text, children }: LayoutProps) => {
  return (
    <Container>
      <Table>
        <Tr>
          <Td>
            <Image src={'logo.png'} />
          </Td>
        </Tr>
        <Tr>
          <Title>{title}</Title>
        </Tr>

        <Tr>
          <Text>{text}</Text>
        </Tr>

        <Tr>
          <Td>{children}</Td>
        </Tr>
      </Table>
    </Container>
  );
};