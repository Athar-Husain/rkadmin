import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Divider, Box, Breadcrumbs as MuiBreadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Breadcrumbs = ({
  title,
  subtitle,
  divider = true,
  isCard = false,
  sx = {},
  dividerColor,
  links = [],
  ...rest
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        background: isCard ? 'background.paper' : 'transparent',
        boxShadow: isCard ? 1 : 'none',
        border: isCard ? `1px solid ${theme.palette.divider}` : 'none',
        padding: isCard ? theme.spacing(3) : 0,
        ...sx,
      }}
      aria-label="breadcrumb-container"
      square={!isCard}
    >
      <CardContent sx={{ pl: 0, pt: 0, pb: '0 !important' }}>
        {links.length > 0 && (
          <MuiBreadcrumbs
            aria-label="breadcrumb"
            separator={dividerColor ? <Divider sx={{ bgcolor: dividerColor, height: 20 }} orientation="vertical" /> : undefined}
            {...rest}
          >
            {links.map(({ label, to }, index) => {
              const isLast = index === links.length - 1;
              return isLast ? (
                <Typography key={label} color="text.primary" sx={{ fontWeight: 700, userSelect: 'none' }}>
                  {label}
                </Typography>
              ) : (
                <Link
                  key={label}
                  component={RouterLink}
                  to={to}
                  underline="hover"
                  color="inherit"
                  sx={{ fontWeight: 500 }}
                >
                  {label}
                </Link>
              );
            })}
          </MuiBreadcrumbs>
        )}

        {title && (
          <Typography
            sx={{
              fontWeight: 600,
              mt: theme.spacing(1),
              fontSize: { xs: '1.5rem', sm: '2rem' },
              lineHeight: 1.2,
            }}
            variant="h3"
          >
            {title}
          </Typography>
        )}

        {subtitle && (
          <Typography
            sx={{
              fontWeight: 400,
              mt: theme.spacing(0.5),
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
            variant="subtitle1"
          >
            {subtitle}
          </Typography>
        )}

        {divider && <Divider sx={{ mb: theme.spacing(3), mt: theme.spacing(2) }} />}
        {!divider && !isCard && <Box sx={{ mb: theme.spacing(3) }} />}
      </CardContent>
    </Card>
  );
};

Breadcrumbs.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  divider: PropTypes.bool,
  isCard: PropTypes.bool,
  sx: PropTypes.object,
  dividerColor: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    })
  ),
};

export default Breadcrumbs;
