import { useAtom } from "@reatom/react"
import { useEffect } from "react"
import { bivariateLayersGroupAtom } from "~features/layers_panel/atoms/bivariateLayersGroupAtom"
import { BivariateLegend } from '~components/BivariateLegend/BivariateLegend';

export function LayersBivariateLegend({ ids }: { ids: string[] }) {
  const [{ activeLayer, activeLayerIsVisible }, { setBivariateIds }] = useAtom(bivariateLayersGroupAtom)

  useEffect(() => {
    setBivariateIds(ids)
  }, [ids])

  if (!activeLayer) return null
  return (<BivariateLegend layer={activeLayer} showDescrption={false} isHidden={!activeLayerIsVisible} />)
}
