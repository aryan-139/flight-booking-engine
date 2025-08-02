import { Router } from 'express';
import { RateLimiter } from '../middleware/rateLimiter';
import { ResponseHelper } from '../helpers/response';

const router = Router();

// Get banned IPs
router.get('/banned-ips', (req, res) => {
  const limiter = RateLimiter.getInstance();
  const bannedIPs = limiter.getBannedIPs();
  
  ResponseHelper.success(res, { bannedIPs }, 'Banned IPs retrieved successfully');
});

// Unban an IP
router.post('/unban-ip/:ip', (req, res) => {
  const { ip } = req.params;
  const limiter = RateLimiter.getInstance();
  const success = limiter.unbanIP(ip);
  
  if (success) {
    ResponseHelper.success(res, { ip }, `IP ${ip} has been unbanned`);
  } else {
    ResponseHelper.error(res, `IP ${ip} is not banned`, 404);
  }
});

export default router;