import React from 'react';
import { Card as TamaguiCard, styled } from 'tamagui';

/**
 * Card Component
 * 
 * Reusable card container with theme-aware styling.
 */

const StyledCard = styled(TamaguiCard, {
    backgroundColor: '$cardBackground',
    borderWidth: 1,
    borderColor: '$cardBorder',
    borderRadius: '$4',
    padding: '$4',
    shadowColor: '$shadowColor',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
});

export const Card = StyledCard;
