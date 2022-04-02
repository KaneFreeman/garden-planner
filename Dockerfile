FROM registry.gitlab.com/tozd/docker/meteor:ubuntu-focal-2.7

ENV ROOT_URL=http://garden-planner.ga
ENV MAIL_URL=smtps://lautzd%40gmail.com:mmfqzygaogkobeds@smtp.gmail.com:465
ENV METEOR_SETTINGS='{"packages": {"mongo": {"options": {"tlsAllowInvalidCertificates": true}}},"MONGO_URL": "mongodb://dbuser:MsMQY_Hqb%23.r4%26r-@localhost:27017/?authMechanism=DEFAULT","MAIL_URL": "smtps://lautzd%40gmail.com:mmfqzygaogkobeds@smtp.gmail.com:465","public": {"masterAccount": "lautzd@gmail.com","masterName": "Dan"}}'
ENV PORT=3000
ENV MONGO_URL=mongodb://localhost:27017/garden-planner
ENV MONGO_OPLOG_URL=mongodb://localhost:27017/local
ENV HOME=/
ENV LOG_TO_STDOUT=1
ENV METEOR_NO_RELEASE_CHECK=1
ENV METEOR_ALLOW_SUPERUSER=true
