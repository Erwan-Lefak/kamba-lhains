import { NextApiRequest, NextApiResponse } from 'next';
import { businessMetrics } from '../../../lib/analytics/business-metrics';

interface MetricsRequest {
  timeRange?: string;
  category?: string;
  includeInsights?: boolean;
  includePredictions?: boolean;
  includeSegmentation?: boolean;
  includeCohorts?: boolean;
}

interface MetricsResponse {
  success: boolean;
  data?: {
    metrics: any[];
    insights?: any[];
    predictions?: any;
    segmentation?: any[];
    cohorts?: any;
    summary: {
      totalMetrics: number;
      criticalIssues: number;
      opportunities: number;
      lastUpdated: string;
    };
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MetricsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  // Vérification d'authentification admin
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  try {
    const {
      timeRange = '30d',
      category,
      includeInsights = true,
      includePredictions = false,
      includeSegmentation = false,
      includeCohorts = false
    }: MetricsRequest = req.query as any;

    const startTime = Date.now();

    // Calculer les métriques principales
    let metrics = await businessMetrics.calculateAllMetrics(timeRange);

    // Filtrer par catégorie si spécifié
    if (category) {
      metrics = metrics.filter(m => m.category === category);
    }

    const responseData: any = {
      metrics,
      summary: {
        totalMetrics: metrics.length,
        criticalIssues: 0,
        opportunities: 0,
        lastUpdated: new Date().toISOString()
      }
    };

    // Générer les insights si demandé
    if (includeInsights) {
      const insights = await businessMetrics.generateBusinessInsights(metrics);
      responseData.insights = insights;
      responseData.summary.criticalIssues = insights.filter(i => i.type === 'warning').length;
      responseData.summary.opportunities = insights.filter(i => i.type === 'opportunity').length;
    }

    // Générer les prédictions si demandé
    if (includePredictions) {
      responseData.predictions = await businessMetrics.generatePredictions(metrics, 30);
    }

    // Calculer la segmentation si demandé
    if (includeSegmentation) {
      responseData.segmentation = await businessMetrics.calculateCustomerSegmentation();
    }

    // Analyser les cohortes si demandé
    if (includeCohorts) {
      responseData.cohorts = await businessMetrics.calculateCohortAnalysis('monthly');
    }

    const processingTime = Date.now() - startTime;
    console.log(`Business metrics calculated in ${processingTime}ms`);

    res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Business metrics API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

function isAuthenticated(req: NextApiRequest): boolean {
  // Vérification d'authentification simplifiée
  const authHeader = req.headers.authorization;
  const cookieAuth = req.headers.cookie?.includes('admin_token=admin_authenticated');
  
  return !!(authHeader || cookieAuth);
}