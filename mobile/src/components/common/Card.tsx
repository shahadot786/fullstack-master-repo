import React from 'react';
import { Card as TamaguiCard, styled } from 'tamagui';

/**
 * Card Component
 * 
 * Reusable card container with theme-aware styling.
 */

const StyledCard = styled(TamaguiCard, {
    backgroundColor: '$cardBackground',
    borderWidth: 1.5,
    borderColor: '$cardBorder',
    borderRadius: '$4',
    padding: '$4',
});

export const Card = StyledCard;
