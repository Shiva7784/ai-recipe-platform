"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import PricingSection from './PricingSection';

function PricingModal({ subscriptionTier = "free"  ,children}) {
    const [isOpen , setIsOpen] = useState(false);

    const canOpen = subscriptionTier === "free";

    return (
        <Dialog open={isOpen} onOpenChange={canOpen ? setIsOpen : undefined}>
          <DialogTrigger asChild disabled={!canOpen}>
              {children}
          </DialogTrigger>
          <DialogContent className="p-8 pt-4 sm:max-w-4xl">
            <DialogTitle/>
            
            <PricingSection />
            
            
          </DialogContent>
      </Dialog>
        
    )
}

export default PricingModal


