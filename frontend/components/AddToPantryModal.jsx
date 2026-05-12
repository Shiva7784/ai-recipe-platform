"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Camera, Plus } from 'lucide-react'
import useFetch from '@/hooks/use-fetch'
import { addPantryItemManually, saveToPantry, scanPantryImage } from '@/actions/pantry.actions'



function AddToPantryModal({ isOpen, onClose, onSuccess}) {

    const [activeTab, setActiveTab] = useState("scan");
    const [selectedImage, setSelectedImage] = useState(null);
    const [scannedIngredients, setScannnedIngredients] = useState([]);
    const [manualItem, setManualItem] = useState({ name: " ", quantity: ""});

    //Scan image
    const {
      loading: scanning,
      data: scanData,
      fb: scanImage,
    } = useFetch(scanPantryImage);

    //Save scanned items
    const {
      loading: saving,
      data: saveData,
      fn: saveScannedItems,
    } = useFetch(saveToPantry);

    // Add manual item
    const {
      loading: adding,
      data: addData,
      fn: addManualItem,
    } = useFetch(addPantryItemManually);

    const handleClose = () => {
        setActiveTab("scan");
        setSelectedImage(null);
        setScannnedIngredients([]);
        setManualItem({ name: "", quantity:""});
        onClose();
    }

    const handleAddManual = () => {};

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="scan" className="gap-2">
          <Camera className='w-4 h-4 '/>
          AI Scan
        </TabsTrigger>
        <TabsTrigger value="manual" className="gap-2">
          <Plus className='w-4 h-4 '/>
          Add Manually
        </TabsTrigger>
      </TabsList>
      <TabsContent value="scan" className="space-y-6 mt-6">
      AI scan
        
      </TabsContent>
      <TabsContent value="manual" className="mt-6">
        <form onSubmit={handleAddManual} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-stone-700 mb-2'>
              Ingredient Name
            </label>
            <input
              type='text'
              value={manualItem.name}
              onChange={(e) => setManualItem({ ...manualItem, name: e.target.value})}
              placeholder='e.g., Chicken breast'
              className='w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500'
              disabled={adding}
            />
          </div>
        </form>
       
      </TabsContent>
      
    </Tabs>
        </DialogContent>
    </Dialog>
    )
}

export default AddToPantryModal