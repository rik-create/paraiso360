import type { Feature, FeatureCollection, Polygon, MultiPolygon } from 'geojson'

export interface LotProperties {
  id: number
  lot_number: string
  status: string
  block: string
  section: string
}

export interface BlockProperties {
  id: number
  block_id: string
  name: string
}

export type LotFeature = Feature<Polygon, LotProperties>
export type LotFeatureCollection = FeatureCollection<Polygon, LotProperties>

export type BlockFeature = Feature<MultiPolygon, BlockProperties>
export type BlockFeatureCollection = FeatureCollection<MultiPolygon, BlockProperties>
