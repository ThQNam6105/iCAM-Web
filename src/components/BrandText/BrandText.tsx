import React from 'react';
import { highlightBrandName } from '../../utils/brandUtils';

interface BrandTextProps {
  children: string;
}

export const BrandText: React.FC<BrandTextProps> = ({ children }) => <>{highlightBrandName(children)}</>;
