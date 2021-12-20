import { useAtom } from "@reatom/react"
import { useEffect } from "react"
import { BivariateLegend } from "~components/LegendPanel/components/BivariateLegend/BivariateLegend"
import { bivariateLayersGroupAtom } from "~features/layers_panel/atoms/bivariateLayersGroupAtom"

export function LayersBivariateLegend({ ids }: { ids: string[] }) {
  const [{ activeLayer }, { setBivariateIds }] = useAtom(bivariateLayersGroupAtom)

  useEffect(() => {
    setBivariateIds(ids)
  }, [ids])

  if (!activeLayer) return null
  return (<BivariateLegend layer={activeLayer} showDescrption={false} />)
}
