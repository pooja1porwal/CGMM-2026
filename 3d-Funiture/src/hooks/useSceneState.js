import { useCallback, useState } from 'react'
import { INITIAL_FURNITURE, makeFurniture } from '../data/furniture'

const STORAGE_KEY = 'cgms-furniture-lab-scene-v1'
const fresh = () => INITIAL_FURNITURE.map((item) => ({ ...item, position: [...item.position], rotation: [...item.rotation], scale: [...item.scale] }))

export function useSceneState() {
  const [furniture, setFurniture] = useState(fresh)
  const [selectedId, setSelectedId] = useState('sofa-default')
  const selected = furniture.find((item) => item.id === selectedId) || null
  const add = useCallback((type) => {
    const item = makeFurniture(type, furniture.length)
    setFurniture((items) => [...items, item])
    setSelectedId(item.id)
  }, [furniture.length])
  const update = useCallback((id, patch) => setFurniture((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item)), [])
  const remove = useCallback(() => { if (!selectedId) return; setFurniture((items) => { const next = items.filter((item) => item.id !== selectedId); setSelectedId(next[0]?.id || null); return next }) }, [selectedId])
  const reset = useCallback(() => { setFurniture(fresh()); setSelectedId('sofa-default') }, [])
  const save = useCallback(() => localStorage.setItem(STORAGE_KEY, JSON.stringify({ furniture })), [furniture])
  const load = useCallback(() => { try { const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (!Array.isArray(parsed?.furniture)) throw new Error(); setFurniture(parsed.furniture); setSelectedId(parsed.furniture[0]?.id || null); return true } catch { return false } }, [])
  return { furniture, selected, selectedId, setSelectedId, add, update, remove, reset, save, load }
}
